import { configure, envvars } from "@trigger.dev/sdk/v3";

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

configure({
  accessToken: required("POSTPOOCH_TRIGGER_UPLOAD_TOKEN"),
});

const variables = {
  DATABASE_URL: required("POSTPOOCH_DATABASE_URL"),
  ZERNIO_API_KEY: required("POSTPOOCH_ZERNIO_API_KEY"),
};

await envvars.upload("proj_kkcqmlytccqmpemnjrii", "prod", {
  variables,
  override: true,
});

console.log(`Uploaded environment variables: ${Object.keys(variables).join(", ")}`);
