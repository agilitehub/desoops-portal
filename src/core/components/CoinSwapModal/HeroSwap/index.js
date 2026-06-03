import React, { useState } from 'react'
import { Collapse, Spin } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import Enums from 'core/infra/enums'

const HeroSwap = () => {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      <Collapse
        size='small'
        bordered={false}
        className='coin-swap-notes shrink-0'
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={[
          {
            key: '1',
            label: 'Important Notes',
            children: (
              <p className='m-0 text-sm text-foreground'>
                Transactions usually take a few minutes, but can take up to an hour depending on
                HeroSwap&apos;s Funding Pool.
              </p>
            )
          }
        ]}
      />
      <div className='relative h-[450px] w-full overflow-hidden rounded-[10px] shadow-[0_0_32px_rgba(0,0,0,0.06)]'>
        {isLoading ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-surface'>
            <Spin />
            <span className='mt-2.5 text-base text-foreground'>Loading...</span>
          </div>
        ) : null}
        <iframe
          title={Enums.coinSwap.heroSwap.title}
          className={`h-full w-full border-0 ${isLoading ? 'invisible' : 'visible'}`}
          src={`${Enums.coinSwap.heroSwap.url}?depositTicker=${Enums.coinSwap.heroSwap.depositTicker}&destinationTicker=${Enums.coinSwap.heroSwap.destinationTicker}&affiliateAddress=${Enums.values.DESO_OPS_PUBLIC_KEY}`}
          onLoad={handleLoad}
        />
      </div>
    </div>
  )
}

export default HeroSwap
