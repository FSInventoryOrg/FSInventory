import { useState, ChangeEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';

interface Props {
  className?: string | undefined;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
}
const Recipients = ({ className, recipients, setRecipients }: Props) => {
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRecipientChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRecipient(value);

    const result = z
      .string()
      .trim()
      .email('Not a valid email address')
      .safeParse(value);
    if (!result.success && value.length > 0) {
      const zodError = result.error;
      setErrorMessage(zodError.errors[0].message);
    } else {
      setErrorMessage(null);
    }
    const set = new Set([...recipients]);
    if (set.has(value)) {
      setErrorMessage('Email already added');
    }
  };

  const handleAddRecipient = (email: string) => {
    if (errorMessage === null) {
      setRecipient('');
      setErrorMessage(null);
      const set = new Set([...recipients, email]);
      setRecipients([...set]);
    }
  };

  const handleRemoveRecipient = (email: string) => {
    const set = new Set([...recipients]);
    set.delete(email);
    setRecipients([...set]);
  };
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <div className="flex flex-row gap-2">
        <Input
          type="email"
          placeholder="Email"
          value={recipient}
          onChange={handleRecipientChange}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddRecipient(recipient)}
          disabled={recipient.length === 0 || errorMessage !== null}
        >
          Add
        </Button>
      </div>
      <FormMessage>{errorMessage}</FormMessage>
      <div className="flex flex-wrap gap-1">
        {recipients.map((recipient) => (
          <Badge key={recipient} variant="secondary">
            {recipient}
            <Button
              className="p-0 ml-1 h-6 w-6"
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveRecipient(recipient);
              }}
            >
              <X size={14} />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Recipients;
