import type { RowanProject } from "../settings";

type ProjectCardProps = {
  project: RowanProject;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card__heading">
        <span className="project-card__number">0{index + 1}</span>
        <div>
          <h3>{project.name}</h3>
          <p>({project.location})</p>
        </div>
      </div>

      <div className="project-card__body">
        <div className="project-card__images">
          <div className="project-card__image project-card__image--wide">
            <img
              src={project.image}
              alt={`${project.name} architectural concept`}
            />
          </div>
          <div className="project-card__image project-card__image--crop-one">
            <img src={project.image} alt="" aria-hidden="true" />
          </div>
          <div className="project-card__image project-card__image--crop-two">
            <img src={project.image} alt="" aria-hidden="true" />
          </div>
        </div>

        <div className="project-card__details">
          <div>
            <p className="project-card__price">{project.price}</p>
            <ul>
              {project.facts.slice(0, 3).map((fact, i) => (
                <li key={fact}>
                  <span>({i + 1})</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <a
            className="button button--dark button--small"
            href={`/projects/${project.slug}`}
          >
            View project +
          </a>
        </div>
      </div>
    </article>
  );
}
