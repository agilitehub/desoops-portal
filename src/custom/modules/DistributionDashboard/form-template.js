import React, { useEffect, useState } from 'react'
import { ContainerCard, PrimaryCard } from '../../../reusable-components/AgiliteCards'
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
  theme
} from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { deviceDetect } from 'react-device-detect'
import PatientCheckin from './patient-examination/nurse-examination'
import Reception from './patient-examination/reception'
import DoctorDiagnosis from './patient-examination/doctors-diagnosis'
import coreReducer from '../../../../core/utils/reducer'
import { useDispatch, useSelector } from 'react-redux'
import NurseScreeningMedicalHistory from './patient-examination/nurse-examination-medical-history'
import dayjs from 'dayjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import PatientBookings from '../../../Admin/patients/components/patients-bookings'
import { handleError } from '../../../lib/utils'
import { updateBooking } from '../utils/utils'
import { executeBooking, getBookingState } from '../utils/bpm-utils'
import NewBooking from './new-booking'
import PatientAnalytics from './patient-examination/patient-analytics'

const PatientExaminationForm = ({ data, refreshView, isPreviousBooking, workflowHistory }) => {
  const { token } = theme.useToken()
  const authState = useSelector((state) => state.auth)
  const [bookingData, setBookingData] = useState(data)
  const [hasConfirmedMedicalHistory, setHasConfirmedMedicalHistory] = useState()
  const [billing, setBilling] = useState(data.examinationData?.billing)
  const [script, setScript] = useState(data.examinationData?.diagnosisData?.script || [])
  const [loading, setLoading] = useState(false)
  const [patientAge, setPatientAge] = useState()
  const dispatch = useDispatch()

  const getMainTitle = () => {
    switch (data.status) {
      case 'Nurse Screening':
        return 'Screening'
      case 'Doctor Diagnosis':
        return 'Diagnosis'
      case 'Reception':
        return 'Billing'
      default:
        return 'Patient Examination'
    }
  }

  const getSecondaryTitle = () => {
    switch (data.status) {
      case 'Nurse Screening':
        return 'Screening Information'
      case 'Doctor Diagnosis':
        return 'Diagnosis Information'
      case 'Reception':
        return 'Billing Information'
      default:
        return 'Patient Information'
    }
  }

  const closeTab = () => {
    dispatch(
      coreReducer.actions.closeTab({
        targetKey: data._id,
        removeBreadcrumb: true
      })
    )
    refreshView()
  }

  const isValidStage = () => {
    let role = authState.agiliteUser.extraData.role.type

    if (role === 'medical_professional') {
      if (authState.agiliteUser.extraData.profession === 'nurse') {
        return data.status === 'Nurse Screening' || data.status === 'Completed'
      } else {
        return data.status === 'Doctor Diagnosis' || data.status === 'Completed'
      }
    }
    if (role === 'reception') {
      return data.status === 'Reception' || data.status === 'Completed'
    }
    if (role === 'admin') {
      return true
    }
    return false
  }

  const handleSave = async (isCompleteAction) => {
    let processRecord = null
    let tmpData = null

    if (isCompleteAction) {
      tmpData = checkinForm.getFieldsValue(true)?.checkinData

      const checkinData = tmpData ? JSON.parse(JSON.stringify(tmpData)) : data.examinationData?.checkinData

      if (!checkinData) {
        return message.error('No checkin data has been recorded. Please revise.')
      }

      // Validate controlled fields
      // Blood pressure
      if (patientAge >= 18) {
        if (!checkinData.bloodPressure?.systolic || !checkinData.bloodPressure.diastolic) {
          return message.error('Please record patient blood pressure')
        }
        if (
          checkinData.bloodPressure.diastolic > checkinData.bloodPressure?.systolic ||
          checkinData.bloodPressure.diastolic > 300 ||
          checkinData.bloodPressure.systolic > 300 ||
          checkinData.bloodPressure.diastolic < 1 ||
          checkinData.bloodPressure.systolic < 1
        ) {
          return message.error('Blood pressure reading is invalid.')
        }
      }
      if ((!checkinData.height?.value || checkinData.height?.value === 0) && checkinData.height?.applicable) {
        return message.error('Please record patients height.')
      }
      if ((!checkinData.weight?.value || checkinData.weight?.value === 0) && checkinData.weight?.applicable) {
        return message.error('Please record patients weight.')
      }
      if (!checkinData.oxygenSaturation || checkinData.oxygenSaturation === 0) {
        return message.error('Please record patients oxygen saturation.')
      }
      if (!checkinData.temperature || checkinData.temperature < 32 || checkinData.temperature > 45) {
        if (checkinData.temperature < 32 || checkinData.temperature > 32) {
          return message.error('Patient`s temperature reading is not valid.')
        } else {
          return message.error('Please record patients temperature.')
        }
      }
      if (!checkinData.pulse || checkinData.pulse === 0) {
        return message.error('Please record patients pulse.')
      }

      // Diagnosis
      if (data.status === 'Doctor Diagnosis') {
        const codeIndex = billing.procedures.findIndex((procedure) => procedure.code === 'O190')
        if (!billing.diagnosis || billing.diagnosis.length === 0) {
          return message.error('No diagnosis has been recorded. Please revise.')
        }
        if (codeIndex === -1) {
          return message.error('You need to bill for a consultation. Please revise.')
        }
      }
    }

    setLoading(true)
    try {
      if (isCompleteAction) {
        processRecord = await getBookingState([data.processRef])
        processRecord = await executeBooking(
          data.processRef,
          data.status === 'Completed' ? 'doctor_updates' : 'submit',
          `${authState.agiliteUser.firstName} ${authState.agiliteUser.lastName}`,
          processRecord.key
        )
      }

      await updateBooking(
        {
          'examinationData.checkinData': checkinForm.getFieldsValue(true).checkinData,
          'examinationData.diagnosisData': { ...diagnosisForm.getFieldsValue(true), script },
          'examinationData.billing': billing,
          status: isCompleteAction ? processRecord.processStage : data.status
        },
        { _id: data._id }
      )

      if (isCompleteAction) {
        closeTab()
      } else {
        message.success('Changes saved successfully.')
      }
    } catch (e) {
      message.error(handleError(e, true))
    }

    setLoading(false)
  }

  const generateActions = () => {
    if (authState.agiliteUser.extraData.role.type === 'medical_professional') {
      if (data.status === 'Nurse Screening' && authState.agiliteUser.extraData.profession === 'nurse') {
        return true
      }

      if (
        (data.status === 'Doctor Diagnosis' || data.status === 'Completed') &&
        authState.agiliteUser.extraData.profession === 'doctor'
      ) {
        return true
      }
    }
  }

  useEffect(() => {
    handleCalculateAge()
    // eslint-disable-next-line
  }, [])

  const handleCalculateAge = () => {
    let tmpPatientAge = null
    tmpPatientAge =
      Number(dayjs(new Date()).format('YYYY')) - Number(dayjs(data.patientRecord.dateOfBirth).format('YYYY'))
    setPatientAge(tmpPatientAge)
  }

  const [checkinForm] = Form.useForm()
  const [diagnosisForm] = Form.useForm()

  const handleBookFollowUp = () => {
    dispatch(
      coreReducer.actions.addTab({
        key: 'new_clinic_booking',
        closable: true,
        label: 'New Clinic Booking',
        children: <NewBooking followUpPatient={data.patientRecord} />
      })
    )
  }

  const handleConvertTime = (start, index) => {
    const timeValue = Math.ceil(dayjs(start).diff(workflowHistory.history[index - 1].submissionDate, 'minutes', true))
    let tmpValue = null

    if (timeValue >= 60) {
      tmpValue = (timeValue / 60).toFixed(2)

      return handleConvertHourMinute(tmpValue)
    } else {
      return `${timeValue} minute(s)`
    }
  }

  const handleConvertTotalTime = (value) => {
    let tmpValue = value

    if (value >= 60) {
      tmpValue = (value / 60).toFixed(2)

      if (tmpValue.includes('.')) {
        return handleConvertHourMinute(tmpValue)
      }
    } else {
      return `${value} minute(s)`
    }
  }

  const handleConvertHourMinute = (value) => {
    let hourValue = null
    let minuteValue = null

    hourValue = value.split('.')[0] + ' hour(s) and '

    if (parseInt(value.split('.')[1]) !== 0) {
      minuteValue = Math.ceil((value.split('.')[1] / 100) * 60) + ' minute(s)'
    }

    if (hourValue && minuteValue) {
      return `${hourValue + minuteValue}`
    } else if (hourValue) {
      return hourValue
    }
  }

  return (
    <Row justify='center'>
      <Col xs={24} sm={24} md={24} lg={24} xl={16} xxl={14}>
        <ContainerCard title={getMainTitle().toUpperCase()}>
          <PrimaryCard title={getSecondaryTitle()}>
            <Row gutter={12}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Card title='Patient Information' size='small'>
                  <Row gutter={[12, 12]} justify='space-around'>
                    <Col>
                      {data.patientRecord.profileImage ? (
                        <img
                          src={data.patientRecord.profileImage}
                          alt='Patient'
                          width={deviceDetect().isMobile ? 80 : 100}
                        />
                      ) : (
                        <Avatar shape='square' size={deviceDetect().isMobile ? 80 : 100} icon={<UserOutlined />} />
                      )}
                    </Col>
                    <Col span={16}>
                      <span
                        style={{ fontSize: '16pt', color: token.colorPrimary }}
                      >{`${data.patientRecord.firstName} ${data.patientRecord.lastName}`}</span>
                      <br />
                      <span style={{ fontSize: '12pt' }}>
                        <b>National ID:</b> {data.patientRecord.idNo}
                      </span>
                      <br />
                      <span style={{ fontSize: '12pt' }}>
                        <b>Date Of Birth:</b> {data.patientRecord.dateOfBirth}
                      </span>
                      <br />
                      <span style={{ fontSize: '12pt' }}>
                        <b>Gender:</b>{' '}
                        {data.patientRecord.gender.charAt(0).toUpperCase() + data.patientRecord.gender.slice(1)}
                      </span>
                      <br />
                      <span style={{ fontSize: '12pt' }}>
                        <b>Chief Complaint:</b> <br />
                        {data.chiefComplaint}
                      </span>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Row>
                  {data.status !== 'Reception' ? (
                    <Col span={24}>
                      <Card title='Checkin' size='small'>
                        {bookingData.checkinData && !data.patientRecord.wasImported ? (
                          <Space wrap>
                            <Tag color={token.colorPrimary}>{bookingData.checkinData.ailment}</Tag>
                            {bookingData.checkinData.patientSelection
                              ? bookingData.checkinData.patientSelection.map((selection) => {
                                  if (selection !== 'other')
                                    return (
                                      <>
                                        <Tag color={token.colorSecondary}>{selection}</Tag>
                                      </>
                                    )
                                  return null
                                })
                              : null}

                            {bookingData.checkinData.patientInput ? (
                              <small>
                                <Tag color={token.colorSecondary}>{bookingData.checkinData.patientInput}</Tag>
                              </small>
                            ) : null}
                          </Space>
                        ) : (
                          <Empty description='No Checkin data' />
                        )}
                      </Card>
                    </Col>
                  ) : (
                    <Col span={24}>
                      <Card title='Booking Information' size='small'>
                        <Row>
                          <Col span={24}>
                            <Space wrap>
                              <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                Medical Professional:
                              </div>{' '}
                              {data.medicalProfName}
                            </Space>
                          </Col>
                          <Col span={24}>
                            <Space wrap>
                              <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>Service:</div>{' '}
                              {data.serviceName}
                            </Space>
                          </Col>
                          <Col span={24}>
                            <Space wrap>
                              <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>Payment Method:</div>{' '}
                              {data.paymentMethod}
                            </Space>
                          </Col>
                          <Col span={24}>
                            <Space wrap>
                              <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>Clinic Name:</div>{' '}
                              {data.clinicName}
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  )}
                  {authState.agiliteUser.extraData.role.type === 'medical_professional' ? (
                    <Col style={{ marginTop: 20 }} span={24}>
                      <Card title='Actions' size='small'>
                        <Spin spinning={loading} tip='Loading...'>
                          <Space style={{ justifyContent: 'space-between', width: '100%' }} wrap>
                            <Popconfirm
                              title='Confirmation'
                              description='Are you sure you want to close? Note: You will lose any unsaved changes.'
                              onConfirm={() => closeTab()}
                              okText='Yes'
                              cancelText='No'
                              okButtonProps={{ type: 'primary', style: { backgroundColor: token.colorSuccess } }}
                              cancelButtonProps={{ danger: true }}
                              disabled={loading}
                            >
                              <Button disabled={loading} danger={true}>
                                Close
                              </Button>
                            </Popconfirm>
                            <Button
                              onClick={() => {
                                handleBookFollowUp()
                              }}
                              type='primary'
                            >
                              Book Follow-up
                            </Button>
                            {generateActions() && data.status !== 'Completed' ? (
                              <Button
                                type='primary'
                                onClick={() => handleSave(false)}
                                style={{ backgroundColor: loading ? '' : token.colorSecondary }}
                                disabled={loading}
                              >
                                Save Changes
                              </Button>
                            ) : undefined}
                            {generateActions() ? (
                              <Popconfirm
                                title='Confirmation'
                                description={`Are you sure you want to ${
                                  data.status === 'Nurse Screening'
                                    ? 'complete the Examination'
                                    : 'complete the Diagnosis'
                                }`}
                                onConfirm={() => handleSave(true)}
                                okText='Yes'
                                cancelText='No'
                                okButtonProps={{ type: 'primary', style: { backgroundColor: token.colorSuccess } }}
                                cancelButtonProps={{ danger: true }}
                                disabled={loading}
                              >
                                <Button
                                  disabled={loading}
                                  type='primary'
                                  style={{ backgroundColor: loading ? '' : token.colorSuccess }}
                                >
                                  {data.status === 'Nurse Screening'
                                    ? 'Complete Examination'
                                    : data.status === 'Completed'
                                    ? 'Submit Updates'
                                    : 'Complete Diagnosis'}
                                </Button>
                              </Popconfirm>
                            ) : undefined}
                          </Space>
                        </Spin>
                      </Card>
                    </Col>
                  ) : undefined}
                </Row>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={24}>
                <Tabs type='card'>
                  {isValidStage() ? undefined : (
                    <Tabs.TabPane
                      tab={
                        <span>
                          <FontAwesomeIcon color={token.colorWarning} icon={faExclamationTriangle} /> Notice
                        </span>
                      }
                      key='notice'
                    >
                      <Row gutter={[12, 12]}>
                        <Col>This booking is at {data.status}. There is currently nothing for you to action here.</Col>
                      </Row>
                    </Tabs.TabPane>
                  )}
                  {authState.agiliteUser.extraData.role.type === 'medical_professional' ? (
                    (authState.agiliteUser.extraData.profession === 'nurse' ||
                      authState.agiliteUser.extraData.profession === 'doctor') &&
                    isValidStage() ? (
                      <>
                        <Tabs.TabPane tab='Medical History' key='medicalHistory'>
                          <Row gutter={[12, 12]}>
                            <Col span={24}>
                              <NurseScreeningMedicalHistory
                                setHasConfirmedMedicalHistory={setHasConfirmedMedicalHistory}
                                userRef={data.userRef}
                              />
                            </Col>
                          </Row>
                        </Tabs.TabPane>
                        {authState.agiliteUser.extraData.profession === 'nurse' ? (
                          <Tabs.TabPane
                            disabled={
                              !hasConfirmedMedicalHistory && authState.agiliteUser.extraData.profession !== 'doctor'
                            }
                            tab={
                              hasConfirmedMedicalHistory ? (
                                'Nurse Screening'
                              ) : (
                                <Tooltip title='Please confirm medical history before conducting the examination.'>
                                  Nurse Screening
                                </Tooltip>
                              )
                            }
                            key='checkin'
                          >
                            <Row gutter={[12, 12]}>
                              <Col span={24}>
                                <PatientCheckin
                                  is18={patientAge >= 18}
                                  billing={billing}
                                  setBilling={setBilling}
                                  checkinForm={checkinForm}
                                  data={bookingData}
                                  closeTab={closeTab}
                                  isPreviousBooking={isPreviousBooking}
                                  setData={setBookingData}
                                />
                              </Col>
                            </Row>
                          </Tabs.TabPane>
                        ) : undefined}
                      </>
                    ) : null
                  ) : null}
                  {authState.agiliteUser.extraData.profession === 'doctor' && isValidStage() ? (
                    <>
                      <Tabs.TabPane tab="Doctor's Diagnosis" key='diagnose'>
                        <DoctorDiagnosis
                          script={script}
                          setScript={setScript}
                          billing={billing}
                          setBilling={setBilling}
                          diagnosisForm={diagnosisForm}
                          checkinForm={checkinForm}
                          data={bookingData}
                          setData={setBookingData}
                          closeTab={closeTab}
                          isPreviousBooking={isPreviousBooking}
                        />
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="Patient's Analytics" key='patientAnalytics'>
                        <PatientAnalytics userRef={bookingData.userRef} />
                      </Tabs.TabPane>
                    </>
                  ) : null}
                  {authState.agiliteUser.extraData.profession === 'doctor' ||
                  authState.agiliteUser.extraData.role.type === 'admin' ? (
                    <Tabs.TabPane tab='Previous Bookings' key='previousBookings'>
                      <PatientBookings userRef={data.userRef} isExamination={true} />
                    </Tabs.TabPane>
                  ) : null}
                  {authState.agiliteUser.extraData.role.type === 'reception' && isValidStage() ? (
                    <>
                      <Tabs.TabPane tab='Billing' key='billing'>
                        <Reception data={data} closeTab={closeTab} isPreviousBooking={isPreviousBooking} />
                      </Tabs.TabPane>
                      <Tabs.TabPane tab='Medical Aid' key='medicalAid'>
                        <Row>
                          <Col span={24}>
                            <Card title='Medical Aid Details' type='inner' size='small'>
                              <Row>
                                <Col span={24}>
                                  <Space wrap>
                                    <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                      Medical Aid Name:
                                    </div>{' '}
                                    {data.patientRecord.medicalAid?.name
                                      ? data.patientRecord.medicalAid.name
                                      : 'No medical aid name provided.'}
                                  </Space>
                                </Col>
                                <Col span={24}>
                                  <Space wrap>
                                    <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                      Medical Aid Plan:
                                    </div>{' '}
                                    {data.patientRecord.medicalAid?.plan
                                      ? data.patientRecord.medicalAid?.plan
                                      : 'No medical aid plan provided.'}
                                  </Space>
                                </Col>
                                <Col span={24}>
                                  <Space wrap>
                                    <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                      Medical Aid Option:
                                    </div>{' '}
                                    {data.patientRecord.medicalAid?.option
                                      ? data.patientRecord.medicalAid.option
                                      : 'No medical aid option provided.'}
                                  </Space>
                                </Col>
                                <Col span={24}>
                                  <Space wrap>
                                    <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                      Medical Aid Number:
                                    </div>{' '}
                                    {data.patientRecord.medicalAid?.number
                                      ? data.patientRecord.medicalAid.number
                                      : 'No medical aid number provided.'}
                                  </Space>
                                </Col>
                                <Col span={24}>
                                  <Space wrap>
                                    <div style={{ width: 175, maxWidth: '100%', fontWeight: 'bold' }}>
                                      Dependant Number:
                                    </div>{' '}
                                    {data.patientRecord.medicalAid?.dependantNumber
                                      ? data.patientRecord.medicalAid.dependantNumber
                                      : 'No dependant number provided.'}
                                  </Space>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      </Tabs.TabPane>
                    </>
                  ) : null}
                  <Tabs.TabPane tab='Patient Journey'>
                    <Row>
                      <Col span={24}>
                        <Table
                          rowClassName={token.themeControl}
                          size='small'
                          dataSource={workflowHistory.history}
                          columns={[
                            {
                              title: 'Date / Time',
                              dataIndex: 'submissionDate',
                              key: 'submissionDate',
                              render: (value) => {
                                return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
                              },
                              width: '20%'
                            },
                            {
                              title: 'Responsible User',
                              dataIndex: 'responsibleUsers',
                              key: 'responsibleUsers',
                              render: (responsibleUsers) => responsibleUsers.join(', ')
                            },
                            { title: 'Action Performed', dataIndex: 'optionSelected', key: 'submissionDate' },
                            {
                              title: 'Action Duration',
                              key: 'submissionDate',
                              render: (value, record, index) => {
                                if (
                                  index > 1 &&
                                  [
                                    'Patient Checked In',
                                    'Screening Completed',
                                    'Diagnosis Completed',
                                    'Billing & Booking Completed'
                                  ].includes(record.optionSelected)
                                ) {
                                  return <>{handleConvertTime(record.submissionDate, index)}</>
                                } else {
                                  return <Tag color='orange'>Not Applicable</Tag>
                                }
                              },
                              width: '20%'
                            }
                          ]}
                          summary={() => {
                            let durationTotal = 0

                            workflowHistory.history.forEach((item, index) => {
                              if (
                                index > 1 &&
                                [
                                  'Patient Checked In',
                                  'Screening Completed',
                                  'Diagnosis Completed',
                                  'Billing & Booking Completed'
                                ].includes(item.optionSelected)
                              ) {
                                durationTotal += Math.ceil(
                                  dayjs(item.submissionDate).diff(
                                    workflowHistory.history[index - 1].submissionDate,
                                    'minutes',
                                    true
                                  )
                                )
                              }
                            })

                            return (
                              <>
                                <Table.Summary.Row>
                                  <Table.Summary.Cell>
                                    <b>Booking Duration: </b>
                                  </Table.Summary.Cell>
                                  <Table.Summary.Cell></Table.Summary.Cell>
                                  <Table.Summary.Cell></Table.Summary.Cell>
                                  <Table.Summary.Cell>
                                    <b>{handleConvertTotalTime(durationTotal)}</b>
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              </>
                            )
                          }}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                </Tabs>
              </Col>
            </Row>
          </PrimaryCard>
        </ContainerCard>
      </Col>
    </Row>
  )
}

export default PatientExaminationForm
