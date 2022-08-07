import { useQuery } from '@apollo/client'
import Spinner from './Spinner'
import { GET_PROJECTS } from '../queries/projectQueries'
import ProjectCard from './ProjectCard'

export default function Projects() {
  const { loading, error, data } = useQuery(GET_PROJECTS)

  if (loading) return <Spinner />
  if (error) return <div>Something Went Wrong</div>

  return (
    <>
      {data.projects.length > 0 ? (
        <div className='row'>
          {data.projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div>No Projects</div>
      )}
    </>
  )
}
