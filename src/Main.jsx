import { Layout, Menu } from "antd";
const { Header, Content, Footer } = Layout;

function Main(props) {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Coin Details</Menu.Item>
        </Menu>
      </Header>
      <Content
        className="site-layout pt-4 pb-5 bg-white"
        style={{ padding: "0 50px", marginTop: 64 }}
      >
        {props.children}
      </Content>
      <Footer style={{ textAlign: "center" }}>Created by Kalaivanan</Footer>
    </Layout>
  );
}

export default Main;
