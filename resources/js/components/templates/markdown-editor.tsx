import MDEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, state?: unknown) => void;
}) {
  return (
    <div data-color-mode="system">
      <MDEditor value={value} onChange={onChange} height={300} preview="live" />
    </div>
  );
}
