import Link from "next/link";
import { useSession,signOut } from "next-auth/react";
import classes from "./main-navigation.module.css";

function MainNavigation() {
  const { data, status } = useSession();

  const logoutHandler = () => {
      signOut()
  }


  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {!data && !(status === "loading") && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}

          {data && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}

          {data && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
