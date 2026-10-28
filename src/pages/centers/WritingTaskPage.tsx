import { useNavigate, useParams } from 'react-router-dom'
import { getWriting } from '@/data/writing'
import { ActivityFlow } from '@/components/lesson/ActivityFlow'
import { WritingActivity } from '@/components/writing/WritingActivity'
import { BackLink } from '@/components/common/BackLink'
import NotFound from '../NotFound'

export default function WritingTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const task = getWriting(id)
  if (!task) return <NotFound />
  return (
    <div>
      <BackLink to="/writing" label="Writing" />
      <ActivityFlow key={id} id={`writing:${id}`} skill="writing" onContinue={() => navigate('/writing')} continueLabel="Back to Writing">
        {(finish) => <WritingActivity task={task} onDone={(a) => finish(a)} />}
      </ActivityFlow>
    </div>
  )
}
