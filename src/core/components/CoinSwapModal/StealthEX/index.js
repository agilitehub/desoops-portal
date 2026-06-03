import React from 'react'
import { Collapse } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import Enums from 'core/infra/enums'

const StealthEX = () => {
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
              <ul className='m-0 list-disc space-y-1 pl-4 text-sm text-foreground'>
                <li>Please swap using the exact amount as stated in the payment details below.</li>
                <li>A minimum amount of around $100 in tokens is required for any swap.</li>
                <li>Transactions can take up to an hour to complete depending on StealthEX&apos;s Funding Pool.</li>
                <li>
                  StealthEX performs liquidity maintenance from time to time, making certain exchange-pairs
                  temporarily unavailable.
                </li>
              </ul>
            )
          }
        ]}
      />
      <div className='h-[450px] w-full overflow-hidden rounded-[10px] shadow-[0_0_32px_rgba(0,0,0,0.06)]'>
        <iframe
          title={Enums.coinSwap.stealthEX.title}
          id={Enums.coinSwap.stealthEX.id}
          src={`${Enums.coinSwap.stealthEX.url}/${Enums.coinSwap.stealthEX.affiliateId}`}
          className='h-full w-full border-0'
        />
      </div>
    </div>
  )
}

export default StealthEX
