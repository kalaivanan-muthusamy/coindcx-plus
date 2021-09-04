import { Button, Form, Input } from "antd";

function Auth() {
  const [form] = Form.useForm();

  function onFinish(values) {
    console.log(values);
  }

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header gx-text-center">
          <h1 className="gx-login-title">Sign In</h1>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Auth;
