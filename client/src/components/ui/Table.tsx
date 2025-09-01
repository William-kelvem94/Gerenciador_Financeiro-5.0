import { motion } from 'framer-motion';
import { z } from 'zod';

const TablePropsSchema = z.object({
  columns: z.array(z.string()),
  data: z.array(z.record(z.string(), z.unknown())),
  className: z.string().optional(),
});

export type TableProps = z.infer<typeof TablePropsSchema>;

export default function Table({ columns, data, className = '' }: TableProps) {
  const validated = TablePropsSchema.parse({ columns, data, className });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card glass ${className}`}
      data-testid="cyberpunk-table"
    >
      <table className="w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr>
            {validated.columns.map(col => (
              <th
                key={col}
                className="text-cyber-primary text-glow border-cyber-primary border-b px-4 py-2"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {validated.data.map((row, idx) => (
            <tr key={idx} className="hover:bg-cyber-primary/5 transition-all">
              {validated.columns.map(col => (
                <td key={col} className="text-foreground-secondary px-4 py-2">
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
