import { useSession } from 'next-auth/react';
import classes from './starting-page.module.css';

function StartingPageContent() {
  // Show Link to Login page if NOT auth
  const session = useSession()
  console.log(session,'session')
  return (
    <section className={classes.starting}>
      <h1>Welcome on Board {session?.data?.user?.email}!</h1>
    </section>
  );
}

export default StartingPageContent;
