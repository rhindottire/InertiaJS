import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon, PlayIcon, TimerResetIcon as ResetIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/elements/button';
import Card from '@/components/fragments/card/card';
import { Textarea } from '@/components/ui/textarea';

interface InteractiveCodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

export default function InteractiveCodeBlock({ code: initialCode, language, className }: InteractiveCodeBlockProps) {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [code]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleRun = async () => {
    if (language !== 'javascript' && language !== 'js') {
      setError(`Running ${language} code is not supported yet. Only JavaScript is currently supported.`);
      setOutput('');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      // Create a safe execution environment
      const originalConsoleLog = console.log;
      const logs: string[] = [];

      // Override console.log to capture output
      console.log = (...args) => {
        logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg))).join(' '));
      };

      try {
        // Using Function constructor to evaluate code in a separate scope
        const result = new Function(code)();
        // If the code returns a value, add it to the output
        if (result !== undefined) {
          logs.push(`Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
        }
        setOutput(logs.join('\n'));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
      // Restore the original console.log
      console.log = originalConsoleLog;
    } catch (err) {
      setError(`Failed to execute code, Error: ${err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode.trim());
    setOutput('');
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
  };

  return (
    <Card className={cn('my-6 overflow-hidden', className)}>
      <div className="bg-muted flex items-center justify-between px-4 py-2 text-sm">
        <div className="font-mono text-xs">{language.toUpperCase()}</div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} title="Copy code" aria-label="Copy code">
            {isCopied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} title="Reset code" aria-label="Reset code">
            <ResetIcon className="h-4 w-4" />
          </Button>
          {(language === 'javascript' || language === 'js') && (
            <Button variant="default" size="sm" className="gap-1" onClick={handleRun} disabled={isRunning} title="Run code" aria-label="Run code">
              <PlayIcon className="h-3.5 w-3.5" />
              Run
            </Button>
          )}
        </div>
      </div>

      <div className="relative mx-5">
        <Textarea
          ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="focus:ring-primary w-full resize-none bg-black p-4 font-mono text-sm text-white focus:ring-1 focus:outline-none"
          style={{ minHeight: '100px' }}
          spellCheck="false"
          aria-label="Code editor"
        />
      </div>

      {(output || error) && (
        <div className="border-border border-t">
          <div className="bg-muted px-4 py-2 text-xs font-semibold">Output</div>
          <div className={cn('m-4 max-h-[200px] overflow-auto p-4 font-mono text-sm', error ? 'bg-red-950/20 text-red-400' : 'bg-muted/30')}>
            {error ? error : output || 'No output'}
          </div>
        </div>
      )}
    </Card>
  );
}
