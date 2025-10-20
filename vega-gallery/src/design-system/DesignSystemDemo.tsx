import React from 'react';
import { Button, ButtonGroup } from './components/ButtonSystem';
import styles from './DesignSystemDemo.module.css';

/**
 * Design System Demo Component
 * Demonstrates the improved design system with primary, secondary, and tertiary colors
 */
export const DesignSystemDemo: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎨 Design System Demo</h1>
        <p className={styles.subtitle}>
          Showcasing the improved color system with primary, secondary, and tertiary variants
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Hierarchy</h2>
        <div className={styles.buttonGroup}>
          <Button variant="primary" size="medium">
            Primary Action
          </Button>
          <Button variant="secondary" size="medium">
            Secondary Action
          </Button>
          <Button variant="tertiary" size="medium">
            Tertiary Action
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Sizes</h2>
        <div className={styles.buttonGroup}>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Semantic Colors</h2>
        <div className={styles.buttonGroup}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Groups</h2>
        <ButtonGroup buttonStyle="floating">
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="tertiary">Reset</Button>
        </ButtonGroup>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Color Tokens</h2>
        <div className={styles.colorGrid}>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-primary)' }}>
            <span>Primary</span>
            <code>var(--color-primary)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-secondary)' }}>
            <span>Secondary</span>
            <code>var(--color-secondary)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-tertiary)' }}>
            <span>Tertiary</span>
            <code>var(--color-tertiary)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-success)' }}>
            <span>Success</span>
            <code>var(--color-success)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-warning)' }}>
            <span>Warning</span>
            <code>var(--color-warning)</code>
          </div>
          <div className={styles.colorSwatch} style={{ backgroundColor: 'var(--color-error)' }}>
            <span>Error</span>
            <code>var(--color-error)</code>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Spacing Scale</h2>
        <div className={styles.spacingDemo}>
          <div className={styles.spacingItem} style={{ height: 'var(--spacing-1)' }}>
            <span>--spacing-1 (4px)</span>
          </div>
          <div className={styles.spacingItem} style={{ height: 'var(--spacing-2)' }}>
            <span>--spacing-2 (8px)</span>
          </div>
          <div className={styles.spacingItem} style={{ height: 'var(--spacing-4)' }}>
            <span>--spacing-4 (16px)</span>
          </div>
          <div className={styles.spacingItem} style={{ height: 'var(--spacing-6)' }}>
            <span>--spacing-6 (24px)</span>
          </div>
          <div className={styles.spacingItem} style={{ height: 'var(--spacing-8)' }}>
            <span>--spacing-8 (32px)</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography Scale</h2>
        <div className={styles.typographyDemo}>
          <h1 style={{ fontSize: 'var(--typography-fontSize-4xl)' }}>Heading 1</h1>
          <h2 style={{ fontSize: 'var(--typography-fontSize-3xl)' }}>Heading 2</h2>
          <h3 style={{ fontSize: 'var(--typography-fontSize-2xl)' }}>Heading 3</h3>
          <p style={{ fontSize: 'var(--typography-fontSize-base)' }}>Body text</p>
          <small style={{ fontSize: 'var(--typography-fontSize-sm)' }}>Small text</small>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
