import React, { useReducer } from 'react'
import { identity, configure } from 'deso-protocol'
import { Col, Row, message, Card } from 'antd'
import { faCheckCircle, faBitcoinSign } from '@fortawesome/free-solid-svg-icons'
import { LoginOutlined } from '@ant-design/icons'
import {
  Paper,
  Avatar,
  Center,
  Space,
  Group,
  Button,
  Text,
  Image,
  Container,
  SimpleGrid,
  ThemeIcon,
  Stack
} from '@mantine/core'
import { MdPayments } from 'react-icons/md'
import { PiHandCoinsDuotone } from 'react-icons/pi'
import { BsCoin } from 'react-icons/bs'

// Utils
import styles from './style.module.sass'
import logo from '../../assets/deso-ops-logo-full.png'
import feature from '../../assets/feature-animation.gif'
import VideoModal from '../../reusables/components/VideoModal'
import Enums from '../../lib/enums'
import { useSelector } from 'react-redux'
import { getDeSoConfig } from '../../lib/deso-controller-graphql'
import CoinSwapModal from '../../reusables/components/CoinSwapModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

configure(getDeSoConfig())

const reducer = (state, newState) => ({ ...state, ...newState })

const Login = () => {
  const [state, setState] = useReducer(reducer, {
    openVideoModal: false,
    videoUrl: '',
    videoModalTitle: '',
    openCoinSwapModal: false
  })

  const { isTablet, isSmartphone } = useSelector((state) => state.custom.userAgent)

  const handleLogin = async () => {
    try {
      // setState({ loading: true })
      await identity.login()
    } catch (e) {
      // setState({ loading: false })
      message.error(e)
    }
  }

  const handleWatchIntroductionDeSoOps = () => {
    const videoUrl = Enums.values.DESOOPS_VIDEO_URL
    const videoModalTitle = 'Introduction To DeSoOps'
    const openVideoModal = true

    setState({ openVideoModal, videoUrl, videoModalTitle })
  }

  const handleWatchIntroductionDeSo = () => {
    const videoUrl = Enums.values.DESO_VIDEO_URL
    const videoModalTitle = 'DeSo Essentials'
    const openVideoModal = true

    setState({ openVideoModal, videoUrl, videoModalTitle })
  }

  const handleLaunchCoinSwap = () => {
    setState({ openCoinSwapModal: true })
  }

  const styleProps = {
    rowMarginTop: isTablet ? -100 : isSmartphone ? -20 : -100,
    contentBorderRadius: isSmartphone ? 12 : 30,
    bulletPointFontSize: isSmartphone ? 14 : 16,
    logoWidth: isSmartphone ? 200 : 300
  }

  return (
    <>
      <Space h={55} />
      <Container size='lg'>
        <Paper withBorder p='md' radius='lg' shadow='xl'>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing='sm' verticalSpacing='sm'>
            <Image
              src={feature}
              h={700}
              radius='md'
              title='Data illustrations by Storyset'
              alt='Data illustration from Storyset'
              visibleFrom='sm'
            />

            <Image
              src={feature}
              fit='contain'
              radius='md'
              title='Data illustrations by Storyset'
              alt='Data illustration from Storyset'
              hiddenFrom='sm'
            />

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                paddingRight: '40px',
                paddingLeft: '40px',
                paddingTop: '40px'
              }}
            >
              <div style={{ flex: 1 }}>
                <Center>
                  <Avatar src={logo} size={125} radius={111} />
                </Center>

                <Space h='md' />

                <Text size='xl' fw={500} ta='center'>
                  Welcome to DeSoOps
                </Text>

                <Text size='sm' c='dimmed' ta='center'>
                  Simplify your DeSo journey: Manage projects, reward supporters, and distribute tokens with ease.
                </Text>

                <Space h={70} />

                <SimpleGrid
                  cols={3}
                  spacing={30}
                  breakpoints={[
                    { maxWidth: 'md', cols: 2, spacing: 'md' },
                    { maxWidth: 'sm', cols: 1, spacing: 'sm' }
                  ]}
                  justify='center'
                >
                  <Stack align='center' spacing='xs'>
                    <ThemeIcon variant='light' radius='xl' size='xl'>
                      <MdPayments style={{ width: '75%', height: '75%' }} />
                    </ThemeIcon>
                    <Text size='sm' c='dimmed' ta='center' maw={100}>
                      Manage payment distributions.
                    </Text>
                  </Stack>

                  <Stack align='center' spacing='xs'>
                    <ThemeIcon variant='light' radius='xl' size='xl'>
                      <PiHandCoinsDuotone style={{ width: '75%', height: '75%' }} />
                    </ThemeIcon>
                    <Text size='sm' c='dimmed' ta='center' maw={100}>
                      Distribute to DAO Token, Creator Coin, and NFT Holders.
                    </Text>
                  </Stack>

                  <Stack align='center' spacing='xs'>
                    <ThemeIcon variant='light' radius='xl' size='xl'>
                      <BsCoin style={{ width: '75%', height: '75%' }} />
                    </ThemeIcon>
                    <Text size='sm' c='dimmed' ta='center' maw={100}>
                      Distribute $DESO, DAO Tokens, and Creator Coins.
                    </Text>
                  </Stack>
                </SimpleGrid>

                <Space h='xl' />

                <Group justify='center'>
                  <Button onClick={handleWatchIntroductionDeSo} variant='default' size='xs'>
                    <Text size='xs'>Watch Introduction To DeSo</Text>
                  </Button>

                  <Button onClick={handleWatchIntroductionDeSoOps} variant='default' size='xs'>
                    <Text size='xs'>Watch Introduction To DeSoOps</Text>
                  </Button>
                </Group>
              </div>

              <Space h='md' />

              <Group justify='center' grow mb='xs'>
                <Button onClick={handleLogin} variant='filled' radius='xl'>
                  Sign In with DeSo
                </Button>
              </Group>

              <Group justify='center' grow mb='xs'>
                <Button onClick={handleLaunchCoinSwap} variant='filled' radius='xl' color='green'>
                  Coin Swap
                </Button>
              </Group>
            </div>
          </SimpleGrid>
        </Paper>
      </Container>
      <Space h={55} />

      <VideoModal
        isOpen={state.openVideoModal}
        title={state.videoModalTitle}
        url={state.videoUrl}
        onCloseModal={() => setState({ openVideoModal: false })}
        closeOnOutsideClick={true}
      />
      <CoinSwapModal
        isOpen={state.openCoinSwapModal}
        onCloseModal={() => setState({ openCoinSwapModal: false })}
        closeOnOutsideClick={true}
      />
    </>
  )
}

export default Login
