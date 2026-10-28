import { useNavigate, useParams } from 'react-router-dom'
import { getReading } from '@/data/reading'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { ReadingActivity } from '@/components/reading/ReadingActivity'
import { BackLink } from '@/components/common/BackLink'
import NotFound from '../NotFound'

export default function ReadingTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const task = getReading(id)
  if (!task) return <NotFound />
  return (
    <div>
      <BackLink to="/reading" label="Reading" />
      <ActivityFlow key={id} id={`reading:${id}`} skill="reading" onContinue={() => navigate('/reading')} continueLabel="Back to Reading">
        {(finish) => <ReadingActivity task={task} path={`/reading/${id}`} onDone={(a, m) => finish(a, { mistakes: m })} />}
      </ActivityFlow>
    </div>
  )
}
