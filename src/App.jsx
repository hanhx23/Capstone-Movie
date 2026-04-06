import { Route, Routes } from "react-router"
import { RegisterPage } from "@/features/register"
import { PRIVATE_PATH, PUBLIC_PATH } from "@/constant"
import { MainLayout } from "./layout/MainLayout"
import { UserProfilePage } from "./features/user-profile"
import { UserManagementPage } from "./features/admin"
import { SignInPage } from "./features/sign-in"

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <h1
              className="h-750">
              Home
            </h1>
          } />
        <Route
          path={PUBLIC_PATH.SIGN_IN}
          element={<SignInPage/>} />
          <Route
           path={PUBLIC_PATH.REGISTER}
           element={<RegisterPage/>}
          />
          <Route
           path={PRIVATE_PATH.USER_PROFILE}
           element={<UserProfilePage/>}
          />
          <Route
           path={PRIVATE_PATH.REGISTER}
           element={<UserManagementPage/>}
          />
      </Route>
    </Routes>
  )
}

export default App
