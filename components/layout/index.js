import { AppProvider } from "../context";
import Header from "./header/Header";

const Layout = ({ children, headerFooter }) => {
  const { header, footer } = headerFooter || {};
  return (
    <AppProvider>
      <Header header={header} />
      <main>{children}</main>
    </AppProvider>
  );
};

export default Layout;
