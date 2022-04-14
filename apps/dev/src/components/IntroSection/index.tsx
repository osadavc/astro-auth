import { FC } from "react";
import { Button, Title, GoogleButton } from "@astro-auth/ui";
import { signOut } from "@astro-auth/client";
import styles from "./index.module.css";

interface IntroSectionProps {
  isSignIn?: boolean;
  user?: any;
}

const IntroSection: FC<IntroSectionProps> = ({ isSignIn = false, user }) => {
  return (
    <div className={styles.content}>
      {isSignIn ? (
        <>
          <Title as="h2">{`Welcome To The Dashboard ${
            (user as any).user.given_name
          }`}</Title>
        </>
      ) : (
        <Title as="h2">Welcome To Astro Auth Demo</Title>
      )}
      {isSignIn ? (
        <div className={styles.getStarted}>
          <Button onClick={() => signOut()}>Log Out</Button>
        </div>
      ) : (
        <div className={styles.getStarted}>
          <GoogleButton />
        </div>
      )}
    </div>
  );
};

export default IntroSection;
