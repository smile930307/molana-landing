import React from 'react'

interface ValueCheckBoxProps {
  name: string
  setValue: (value: string) => void
  checked?: boolean
}

export const ValueCheckBox: React.FC<ValueCheckBoxProps> = ({ name, setValue, checked }: ValueCheckBoxProps) => {
  const changeState = () => {
    setValue(name)
  }

  return (
    <>
      <div
        className={`checkbox checkbox--sm checkbox--${checked ? 'selected' : 'disabled'}`}
        onClick={() => changeState()}
      >
        {checked ? <i className='icon icon--tn icon--cross'></i> : ''}
      </div>
    </>
  )
}
