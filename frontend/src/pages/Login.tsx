import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/edutap-logo.svg";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      if (
        error.code === "ERR_NETWORK" ||
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch")
      ) {
        message.error(
          "Cannot connect to server. Please make sure the backend is running on port 5001.",
        );
      } else if (error.response?.status === 401) {
        message.error(
          "Invalid email or password. Please check your credentials.",
        );
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(
          error.message || "Login failed. Please check your credentials.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side - Background Image with Centered Content */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="text-center max-w-sm">
            <div className="mb-8">
              <div className="inline-block bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-3 leading-tight">
              Secure School
              <br />
              Management
            </h1>
            <p className="text-blue-100 text-lg">
              Professional platform for modern education
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Compact Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Compact Login Card */}
          <div className="bg-white rounded-xl shadow-lg">
            {/* Compact Logo Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <img src={logo} alt="EduTap Logo" className="h-8 w-auto" />
                </div>
                <span className="text-xl font-bold text-gray-800">EduTap</span>
              </div>
            </div>

            {/* Compact Form */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                Sign In to Continue
              </h2>

              <Form
                name="login"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
                className="space-y-4"
              >
                <Form.Item name="email" className="mb-2">
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Email address"
                    size="middle"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item name="password" className="mb-1">
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                    size="middle"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <div className="flex justify-between items-center mb-4">
                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="mb-0"
                  >
                    <Checkbox className="text-sm text-gray-600">
                      Remember me
                    </Checkbox>
                  </Form.Item>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="middle"
                    className="h-10 rounded-lg font-medium"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* Small Copyright Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">© 2025 EduTap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
