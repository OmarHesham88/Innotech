import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Collapse from './Collapse';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { ExpansionContext } from './FormLayout';

const BorderedSection = ({ title, children }) => {
    const context = useContext(ExpansionContext);
    const [localExpanded, setLocalExpanded] = useState(true);
    const [initialized, setInitialized] = useState(false);

    const sectionId = title.replace(/\s+/g, '-').toLowerCase();

    useEffect(() => {
        if (context && !initialized) {
            context.setExpandedSections(prev => ({
                ...prev,
                [sectionId]: context.isAllExpanded
            }));
            setInitialized(true);
        }
    }, [context, initialized, sectionId]);

    const toggleExpand = () => {
        if (context) {
            context.setExpandedSections(prev => ({
                ...prev,
                [sectionId]: !prev[sectionId]
            }));
        } else {
            setLocalExpanded(!localExpanded);
        }
    };

    const isExpanded = context 
        ? (context.expandedSections[sectionId] ?? context.isAllExpanded)
        : localExpanded;

    return (
        <Box sx={{
            position: 'relative',
            border: '1px solid #0A7EA4',
            borderRadius: '4px',
            padding: '8px',
            marginBottom: '24px',
            background: 'white'
        }}>
            <Box sx={{
                position: 'absolute',
                top: '-12px',
                left: '16px',
                backgroundColor: 'white',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#0A7EA4',
                    }}
                >
                    {title}
                </Typography>
                <IconButton
                    onClick={toggleExpand}
                    size="small"
                    sx={{
                        border: '1px solid #0A7EA4',
                        padding: '2px',
                        backgroundColor: 'white',
                        '&:hover': {
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                >
                    {isExpanded ?
                        <IconChevronUp size={16} color="#0A7EA4" /> :
                        <IconChevronDown size={16} color="#0A7EA4" />
                    }
                </IconButton>
            </Box>
            <Collapse isOpen={isExpanded}>
                {children}
            </Collapse>
        </Box>
    );
};

export default BorderedSection;