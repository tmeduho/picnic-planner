import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './settings-form-context'
import {
  Slider,
  SubscribeButton,
  TextField,
} from '@/components/form-components'

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    Slider,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
