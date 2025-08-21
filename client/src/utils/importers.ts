export function importFromCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      resolve(rows);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
