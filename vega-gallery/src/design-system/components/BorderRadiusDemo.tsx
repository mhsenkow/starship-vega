import React from 'react';
import styles from './BorderRadiusDemo.module.css';

/**
 * Demo component showcasing the border radius intent system
 * This demonstrates how different components use appropriate border radius values
 */
export const BorderRadiusDemo: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2>Border Radius Intent System Demo</h2>
      
      <section className={styles.section}>
        <h3>Interactive Elements</h3>
        <div className={styles.buttonGroup}>
          <button className={styles.primaryButton}>Primary Button</button>
          <button className={styles.secondaryButton}>Secondary Button</button>
          <button className={styles.pillButton}>Pill Button</button>
          <button className={styles.iconButton}>⚙️</button>
        </div>
        
        <div className={styles.inputGroup}>
          <input className={styles.defaultInput} placeholder="Default Input" />
          <input className={styles.searchInput} placeholder="Search Input" />
          <select className={styles.selectInput}>
            <option>Select Option</option>
          </select>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Content Containers</h3>
        <div className={styles.cardGroup}>
          <div className={styles.defaultCard}>
            <h4>Default Card</h4>
            <p>Standard card with default border radius</p>
          </div>
          <div className={styles.elevatedCard}>
            <h4>Elevated Card</h4>
            <p>Elevated card with more pronounced border radius</p>
          </div>
          <div className={styles.compactCard}>
            <h4>Compact Card</h4>
            <p>Compact card with minimal border radius</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Feedback Elements</h3>
        <div className={styles.badgeGroup}>
          <span className={styles.defaultBadge}>Default Badge</span>
          <span className={styles.squareBadge}>Square Badge</span>
          <span className={styles.roundedBadge}>Rounded Badge</span>
        </div>
        
        <div className={styles.overlayGroup}>
          <div className={styles.tooltip}>Tooltip</div>
          <div className={styles.toast}>Toast Notification</div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Chart & Visualization</h3>
        <div className={styles.chartGroup}>
          <div className={styles.chartCard}>
            <div className={styles.chartContainer}>
              <div className={styles.chartPlaceholder}>Chart</div>
            </div>
            <div className={styles.chartLegend}>Legend</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3>Layout Sections</h3>
        <div className={styles.layoutGroup}>
          <div className={styles.sectionContainer}>Main Section</div>
          <div className={styles.panelContainer}>Side Panel</div>
          <div className={styles.heroContainer}>Hero Section</div>
        </div>
      </section>
    </div>
  );
};

export default BorderRadiusDemo;
