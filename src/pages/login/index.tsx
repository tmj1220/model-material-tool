import React from 'react'
import { useIntl } from 'react-intl'
import {
  Card, Form, Input, Button,
} from 'antd'
import { useModelDispatchers, useModelEffectsLoading } from '@/store'
import s from './index.less'

interface LoginProps { }

const Login: React.FC<LoginProps> = () => {
  const intl = useIntl()
  const { login } = useModelDispatchers('login')
  const { login: isLoading } = useModelEffectsLoading('login')

  return (
    <div className={s.root}>
      <h1>hello world</h1>
      <Card>
        <Form
          name="login"
          onFinish={login}
          labelCol={{ flex: '110px' }}
          labelAlign="left"
          labelWrap
          wrapperCol={{ flex: 1 }}
          // colon={false}
          requiredMark={false}
        >
          <Form.Item
            label={intl.formatMessage({ id: 'login.form.userName' })}
            name="username"
            rules={[
              {
                required: true,
                max: 18,
                min: 4,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'login.form.password' })}
            name="password"
            rules={[
              {
                required: true,
              },
              {
                validator(rule, value) {
                  console.log('rule', value);
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 },
            }}
          >
            <Button type="primary" loading={isLoading} htmlType="submit">
              {intl.formatMessage({ id: 'login.form.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
};

export default Login
