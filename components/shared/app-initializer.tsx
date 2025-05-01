import React, { useEffect, useState } from 'react'
import useSettingStore from '@/hooks/use-setting-store'
import { ClientSetting } from '@/types'

export default function AppInitializer({
  setting,
  children,
}: {
  setting: ClientSetting
  children: React.ReactNode
}) {
  const [rendered, setRendered] = useState(false)
  useEffect(() => {
    if (!rendered) {
      useSettingStore.setState({ setting })
      setRendered(true)
    }
  }, [setting, rendered])

  return children
}
