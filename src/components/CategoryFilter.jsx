import React from 'react';
import { Box, Button, Heading, Flex, Wrap, WrapItem } from '@chakra-ui/react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other'];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
      <Heading as="h3" size="md" mb={4}>Filter by Category</Heading>
      <Wrap spacing={2}>
        {CATEGORIES.map(category => (
          <WrapItem key={category}>
            <Button
              onClick={() => onCategoryChange(category)}
              colorScheme={selectedCategory === category ? 'blue' : 'gray'}
              variant={selectedCategory === category ? 'solid' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
  );
}

export default CategoryFilter;
