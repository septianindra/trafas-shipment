import React from 'react'

function EditLogistic() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: '',
    },
  })

  const updateOrderStatus = useSelector(
    (state) => state.orders.updateOrderStatus,
  )
  const canSave = createOrderStatus === 'idle'

  return <div></div>
}

export default EditLogistic
