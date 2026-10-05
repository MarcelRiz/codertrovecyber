import React from 'react'
import { Skeleton } from 'antd'
import { v4 as uuidv4 } from 'uuid'

const {
  Image: SkeletonImage,
  Avatar: SkeletonAvatar,
  Input: SkeletonInput,
} = Skeleton
export default function SkeletonComponent({
  amount = 1,
  loading = false,
  paragraph = { rows: 1, width: '100%' },
  avatarShape = null,
  children = null,
  active = true,
  margin = 'auto',
}) {
  const renderSkeleton = () => {
    if (children) {
      return (
        <Skeleton loading={loading} active={active} paragraph={paragraph}>
          {children}
        </Skeleton>
      )
    }

    return [...Array(amount)].map(() => (
      <Skeleton loading={loading} key={uuidv4()} active={active} avatar>
        <SkeletonImage />
        <SkeletonAvatar shape={avatarShape || 'square'} />
        <SkeletonInput />
      </Skeleton>
    ))
  }

  return <div style={{ margin }}>{renderSkeleton()}</div>
}
