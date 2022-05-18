import React from 'react'
import {
  Form, Input, Button,
} from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useModelDispatchers, useModelEffectsLoading } from '@/store'
import logo from '@/assets/images/icons/logo.svg'
import s from './index.less'

interface LoginProps { }

const Login: React.FC<LoginProps> = () => {
  const { login } = useModelDispatchers('login')
  const { login: isLoading } = useModelEffectsLoading('login')

  return (
    <div className={s['login-root']}>
      <aside />
      <section>
        <header>
          <img src={logo} alt="" />
          <h1>Logo</h1>
        </header>
        <section>
          <Form
            name="login"
            onFinish={login}
            labelCol={{ flex: '120px' }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
          // colon={false}
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱',
                },
                {
                  max: 18,
                  min: 4,
                  message: '邮箱长度限制在4-18个字符以内',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="邮箱" />
            </Form.Item>
            <Form.Item
              // label={intl.formatMessage({ id: 'login.form.password' })}
              name="password"
              rules={[
                {
                  required: true, message: '请输入密码',
                },
                {
                  validator(rule, value) {
                    console.log('rule', value);
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" block size="large" loading={isLoading} htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </section>

    </div>
  )
};

export default Login
