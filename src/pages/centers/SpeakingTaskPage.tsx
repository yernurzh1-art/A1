import { useNavigate, useParams } from 'react-router-dom'
import { getSpeaking } from '@/data/speaking'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { SpeakingActivity } from '@/components/speaking/SpeakingActivity'
import NotFound from '../NotFound'
import { BackLink } from '@/components/common/BackLink'

export default function SpeakingTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const task = getSpeaking(id)
  if (!task) return <NotFound />
  return (
    <div>
      <BackLink to="/speaking" label="Speaking" />
      <ActivityFlow key={id} id={`speaking:${id}`} skill="speaking" onContinue={() => navigate('/speaking')} continueLabel="Back to Speaking">
        {(finish) => <SpeakingActivity task={task} onDone={(a) => finish(a)} />}
      </ActivityFlow>
    </div>
  )
}
