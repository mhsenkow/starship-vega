import styles from './Layout.module.css'

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}
