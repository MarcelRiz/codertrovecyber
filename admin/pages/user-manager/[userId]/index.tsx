import React from 'react'
import {
  UserProfile
} from '../../../src/components/sections'
import UserManagerLayout from './UserManagerLayout'

export default function UserDetail() {
  return (
    <UserManagerLayout>      
      <UserProfile />
    </UserManagerLayout>
  )
}