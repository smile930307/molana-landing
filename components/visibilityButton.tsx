import React from 'react'

interface VisibilityButtonProps {
  visible: boolean
  setVisibility: () => void
  classNames?: string
}

export const VisibilityButton: React.FC<VisibilityButtonProps> = ({
  visible,
  setVisibility,
  classNames
}: VisibilityButtonProps) => {
  return (
    <i
      className={`icon icon--sm icon--interactive icon--caret--${visible ? 'up' : 'down'} ${classNames}`}
      onClick={() => setVisibility()}
    ></i>
  )
}
