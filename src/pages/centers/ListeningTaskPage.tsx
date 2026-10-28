import { useNavigate, useParams } from 'react-router-dom'
import { getListening } from '@/data/listening'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ListeningActivity } from '@/components/listening/ListeningActivity'
import { BackLink } from '@/components/common/BackLink'
import NotFound from '../NotFound'

export default function ListeningTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const task = getListening(id)
  if (!task) return <NotFound />
  return (
    <div>
      <BackLink to="/listening" label="Listening Center" />
      <h1 className="mb-5 text-2xl font-extrabold sm:text-3xl">
        {task.emoji} {task.title}
      </h1>
      <ActivityFlow key={id} id={`listening:${id}`} skill="listening" onContinue={() => navigate('/listening')} continueLabel="Back to Listening">
        {(finish) => <ListeningActivity title={task.title} description={task.description} lines={task.lines} exercises={task.exercises} path={`/listening/${id}`} onDone={(a, m) => finish(a, { mistakes: m })} />}
      </ActivityFlow>
    </div>
  )
}
