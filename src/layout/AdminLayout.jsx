import { Layout, Menu } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import { PRIVATE_PATH } from "@/constant";
import { Header, Footer } from "@/shared/components";
import { APP_CONFIG } from "@/config";

const { Sider, Content } = Layout;

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;

    if (path.includes("/admin/users/add")) return "users-add";
    if (path.includes("/admin/users")) return "users";
    if (path.includes("/admin/films/add")) return "add";
    return "films";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header style={{ minHeight: APP_CONFIG.HEADER_HEIGHT }} />

      <div className="flex flex-1">
        <Layout className="bg-white min-h-full w-full">
          <Sider width={220} theme="dark">
            <div className="p-4 text-white font-bold">Admin</div>

            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              defaultOpenKeys={["usersGroup", "filmsGroup"]}
              onClick={({ key }) => {
                if (key === "users") navigate(PRIVATE_PATH.ADMIN);
                if (key === "users-add") navigate(PRIVATE_PATH.USER_ADD);

                if (key === "films") navigate(PRIVATE_PATH.ADMIN_FILMS);
                if (key === "add") navigate(PRIVATE_PATH.ADMIN_FILMS_ADD);
              }}
              items={[
                {
                  key: "usersGroup",
                  label: "Users",
                  icon: <span>👤</span>,
                  children: [
                    { key: "users", label: "User List" },
                    { key: "users-add", label: "Add User" },
                  ],
                },
                {
                  key: "filmsGroup",
                  label: "Films",
                  icon: <span>🎞️</span>,
                  children: [
                    { key: "films", label: "Films" },
                    { key: "add", label: "Add Film" },
                  ],
                },
              ]}
            />
          </Sider>

          <Content className="p-6">
            <Outlet />
          </Content>
        </Layout>
      </div>

      <Footer />
    </div>
  );
};