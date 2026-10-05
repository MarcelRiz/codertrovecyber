import { useRouter } from 'next/router'
import { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button, Form, InputGroup } from 'react-bootstrap'
import Head from 'next/head'
import { Select } from 'antd'
import { useAppDispatch, useAppSelector } from '@states/hooks'
import {
  getUser,
  putUser,
  selectUserPofile,
  setError,
} from '@states/features/userProfileSlice'
import { setCompany, updateCompany } from '@states/features/companySlice'
import Loading from '@components/loading'
import {
  getDepartments,
  selectDepartment,
} from '@src/states/features/departmentSlice'
import styles from './styles.module.scss'
import { StyledSelect } from './buildInComponent.styled'

const { Option } = Select
export default function UserProfile() {
  const dispatch = useAppDispatch()
  const { user, pending, error } = useAppSelector(selectUserPofile)
  const { departments } = useAppSelector(selectDepartment)
  const [stateForm, setStateForm] = useState(0)
  const router = useRouter()
  const queryParms = router.query
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    setValue,
  } = useForm()

  useEffect(() => {
    dispatch(getDepartments())
  }, [])

  const onSubmit = useCallback(values => {
    async function updateUser(data) {
      if (data?.companies?.length > 0) {
        await dispatch(
          updateCompany({ id: data?.companies[0]?.id, position: data.position })
        )
      }
      const response = await dispatch(
        putUser({
          id: data.id,
          firstName: data?.firstName,
          lastName: data?.lastName,
          email: data?.email,
          phone: data?.phone,
          departmentId: data?.departmentId,
        })
      )
      if (response?.payload) {
        dispatch(setError(''))
        setStateForm(0)
      }
    }
    updateUser(values)
  }, [])

  useEffect(() => {
    if (user) {
      if (user?.companies?.length > 0) {
        dispatch(setCompany(user?.companies[0]))
      }
      Object.keys(user).forEach(key => {
        if (key === 'companies') {
          setValue(key, user[key])
          if (user.companies.length > 0) {
            setValue('position', user[key][0]?.position || '')
          } else {
            setValue('position', '')
          }
        } else {
          setValue(key, user[key])
        }
      })
    }
  }, [user])

  useEffect(() => {
    if (queryParms?.userId) {
      dispatch(getUser({ id: queryParms?.userId }))
    }

    return () => {
      dispatch(setError(''))
    }
  }, [queryParms?.id])

  const selectedDepartment = useCallback(
    selectVal => {
      if (selectVal && selectVal.id) {
        return selectVal.id
      }
      return selectVal
    },
    [departments]
  )

  return (
    <>
      <Head>
        <title>Continuumcyber - User Profile</title>
      </Head>
      {pending && <Loading />}
      <h3>User Profile</h3>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <Form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          validated={isSubmitted}
        >
          <Form.Group>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    readOnly={stateForm === 0}
                    {...field}
                    isInvalid={!!errors.firstName}
                  />
                )}
                control={control}
                name="firstName"
                rules={{
                  required: true,
                }}
              />
              {errors && errors.firstName && (
                <Form.Control.Feedback type="invalid">
                  First Name is required.
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    readOnly={stateForm === 0}
                    {...field}
                    isInvalid={!!errors.lastName}
                  />
                )}
                control={control}
                name="lastName"
                rules={{
                  required: true,
                }}
              />
              {errors && errors.lastName && (
                <Form.Control.Feedback type="invalid">
                  First Name is required.
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="position">Title</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    readOnly={stateForm === 0}
                    placeholder="Position Title"
                    {...field}
                    isInvalid={!!errors.position}
                  />
                )}
                control={control}
                name="position"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="email">Email</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="email"
                    readOnly={stateForm === 0}
                    placeholder="Email"
                    {...field}
                    isInvalid={!!errors.email}
                  />
                )}
                control={control}
                name="email"
                rules={{
                  required: 'Please enter your email address',
                }}
              />
              {errors && errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="phone">Mobile Number</Form.Label>
            <InputGroup>
              <Controller
                render={({ field }) => (
                  <Form.Control
                    type="number"
                    readOnly={stateForm === 0}
                    placeholder="Mobile"
                    {...field}
                    isInvalid={!!errors.phone}
                  />
                )}
                control={control}
                name="phone"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="departmentId">Department</Form.Label>
            <Controller
              name="departmentId"
              control={control}
              render={({ field }) => (
                <StyledSelect
                  isError={errors.departmentId && true}
                  disabled={stateForm === 0}
                  className={styles.departmentSelect}
                  showSearch
                  size="large"
                  placeholder="Select department"
                  optionFilterProp="children"
                  allowClear
                  {...field}
                  value={selectedDepartment(field.value)}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {departments.length > 0 &&
                    departments.map(department => (
                      <Option key={department.id} value={department.id}>
                        {department.name}
                      </Option>
                    ))}
                </StyledSelect>
              )}
            />
          </Form.Group>
          {stateForm === 0 && (
            <div className="text-right">
              <Button
                type="submit"
                onClick={() => {
                  setStateForm(1)
                }}
                className="btn btn-primary"
              >
                Edit
              </Button>
            </div>
          )}
          {stateForm === 1 && (
            <div className="text-right">
              <Button
                type="submit"
                onClick={() => {
                  setStateForm(1)
                }}
                className="btn btn-primary"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setStateForm(0)
                  dispatch(setError(''))
                }}
                className="btn btn-secondary"
              >
                Cancel
              </Button>
            </div>
          )}
        </Form>
      </div>
    </>
  )
}
