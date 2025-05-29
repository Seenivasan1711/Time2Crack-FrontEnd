import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="empty-state"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className="empty-state-icon" />
      </motion.div>
      <h2 className="empty-state-text">{title}</h2>
      <p className="empty-state-subtext">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;