import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../design-system/components/ButtonSystem';
import { DataAsset } from '../../types/dataset';
import { CloseIcon } from '../common/Icons';

const Dialog = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$open ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
`;

const DialogTitle = styled.h2`
  margin: 0 0 var(--spacing-6) 0;
  font-size: var(--typography-fontSize-lg);
  font-weight: var(--typography-fontWeight-semibold);
  color: var(--color-text-primary);
`;

const DialogActions = styled.div`
  margin-top: var(--spacing-6);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  width: 100%;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const Label = styled.label`
  font-size: var(--typography-fontSize-sm);
  font-weight: var(--typography-fontWeight-medium);
  color: var(--color-text-primary);
`;

const Input = styled.input`
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--typography-fontSize-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-hover);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const TextArea = styled.textarea`
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--typography-fontSize-sm);
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary-hover);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-2);
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-2);
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border-radius: var(--border-radius-md);
  font-size: var(--typography-fontSize-xs);
  gap: var(--spacing-xs);
`;

const ChipRemoveButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

const AddTagButton = styled(Button)`
  margin-top: var(--spacing-2);
`;

const Section = styled.div`
  margin-top: var(--spacing-6);
`;

const SectionTitle = styled.h3`
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--typography-fontSize-base);
  font-weight: var(--typography-fontWeight-medium);
  color: var(--color-text-primary);
`;

const PreviewContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-2);
  background-color: var(--color-surface-hover);
`;

const PreviewCode = styled.pre`
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-primary);
  font-family: var(--font-family-mono);
`;

interface DatasetMetadataFormProps {
  initialMetadata?: Partial<DataAsset>;
  onSubmit: (metadata: Partial<DataAsset>) => void;
  onCancel: () => void;
  open: boolean;
  previewData?: any[];
}

export const DatasetMetadataForm: React.FC<DatasetMetadataFormProps> = ({ 
  initialMetadata = {}, 
  onSubmit, 
  onCancel, 
  open,
  previewData
}) => {
  const [metadata, setMetadata] = useState<Partial<DataAsset>>({
    name: initialMetadata.name || '',
    description: initialMetadata.description || '',
    tags: initialMetadata.tags || [],
    origin: initialMetadata.origin || 'manual upload',
    source: initialMetadata.source || '',
  });
  
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !metadata.tags?.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    onSubmit(metadata);
  };

  return (
    <Dialog $open={open} onClick={onCancel}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogTitle>Dataset Metadata</DialogTitle>
        <FormContainer>
          <FormField>
            <Label htmlFor="name">Dataset Name *</Label>
            <Input
              id="name"
              name="name"
              value={metadata.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </FormField>
          
          <FormField>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={metadata.description}
              onChange={handleChange}
              rows={3}
            />
          </FormField>
          
          <FormField>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              value={metadata.source}
              onChange={handleChange}
              placeholder="Where did this data come from?"
            />
          </FormField>
          
          <FormField>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              name="origin"
              value={metadata.origin}
              onChange={handleChange}
              placeholder="e.g., manual upload, API import, etc."
            />
          </FormField>
          
          <FormField>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tags and press Enter"
            />
            <AddTagButton 
              variant="secondary" 
              onClick={handleAddTag} 
              disabled={!tagInput.trim()}
            >
              Add Tag
            </AddTagButton>
            
            <TagsContainer>
              {metadata.tags?.map(tag => (
                <Chip key={tag}>
                  {tag}
                  <ChipRemoveButton onClick={() => handleRemoveTag(tag)}>
                    <CloseIcon size={12} />
                  </ChipRemoveButton>
                </Chip>
              ))}
            </TagsContainer>
          </FormField>
          
          {previewData && previewData.length > 0 && (
            <Section>
              <SectionTitle>Data Preview:</SectionTitle>
              <PreviewContainer>
                <PreviewCode>
                  {JSON.stringify(previewData, null, 2)}
                </PreviewCode>
              </PreviewContainer>
            </Section>
          )}
        </FormContainer>
        <DialogActions>
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleSubmit()} 
            variant="primary"
            disabled={!metadata.name?.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}; 