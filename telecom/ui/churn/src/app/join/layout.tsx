import styles from './join.module.css'

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div>{children}</div>
    );
  }
  