import { getDbPool } from '@/lib/db/client';
import { ContextRecordNotFoundError, SocialMediaContextRepository } from '@/lib/social-media/context/repository';

export type SocialMediaCity = {
  id: string;
  cityName: string;
  stateCode: string;
  color: string | null;
};

const CITY_COLUMNS = 'id, city_name, state_code, color';

function toCity(row: {
  id: string;
  city_name: string | null;
  state_code: string | null;
  color: string | null;
}): SocialMediaCity {
  return {
    id: row.id,
    cityName: row.city_name ?? '',
    stateCode: row.state_code ?? '',
    color: row.color,
  };
}

/** Full display label for a city, e.g. "Scottsdale, AZ". */
export function cityLabel(city: Pick<SocialMediaCity, 'cityName' | 'stateCode'>) {
  return `${city.cityName}, ${city.stateCode}`;
}

export async function searchCities(query: string, limit = 10): Promise<SocialMediaCity[]> {
  const term = query.trim();
  if (!term) return [];

  const result = await getDbPool().query<{
    id: string;
    city_name: string | null;
    state_code: string | null;
    color: string | null;
  }>(
    `
      select ${CITY_COLUMNS}
      from public.social_media_cities
      where city_name ilike $1 || '%'
         or city_name ilike '%' || $1 || '%'
      order by
        (city_name ilike $1 || '%') desc,
        city_name,
        state_code
      limit $2
    `,
    [term, limit],
  );

  return result.rows.map(toCity);
}

export async function listCitiesForProfile(profileId: string): Promise<SocialMediaCity[]> {
  const result = await getDbPool().query<{
    id: string;
    city_name: string | null;
    state_code: string | null;
    color: string | null;
  }>(
    `
      select city.id, city.city_name, city.state_code, city.color
      from public.social_media_identities_cities_connections as connection
      join public.social_media_identities as identity on identity.id = connection.identity_id
      join public.social_media_cities as city on city.id = connection.city_id
      where identity.profile_id = $1
      order by connection.created_at
    `,
    [profileId],
  );

  return result.rows.map(toCity);
}

export async function connectCityToProfile(profileId: string, cityId: string): Promise<SocialMediaCity> {
  const cityResult = await getDbPool().query<{
    id: string;
    city_name: string | null;
    state_code: string | null;
    color: string | null;
  }>(
    `
      select ${CITY_COLUMNS}
      from public.social_media_cities
      where id = $1
      limit 1
    `,
    [cityId],
  );

  const city = cityResult.rows[0];
  if (!city) {
    throw new CityNotFoundError();
  }

  await new SocialMediaContextRepository(profileId).connectCity(cityId);

  return toCity(city);
}

export class CityNotFoundError extends Error {
  constructor() {
    super('That city could not be found.');
    this.name = 'CityNotFoundError';
  }
}

export async function disconnectCityFromProfile(profileId: string, cityId: string): Promise<boolean> {
  try {
    return (await new SocialMediaContextRepository(profileId).disconnectCity(cityId)).removed;
  } catch (error) {
    if (error instanceof ContextRecordNotFoundError) return false;
    throw error;
  }
}
