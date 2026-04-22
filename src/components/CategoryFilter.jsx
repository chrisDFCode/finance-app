import React from 'react';
import { Box, Button, Heading, Wrap, WrapItem } from '@chakra-ui/react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other'];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)">
      <Heading as="h3" size="md" mb={4} color="#f2e07a">Filter by Category</Heading>
      <Wrap spacing={2}>
        {CATEGORIES.map(category => (
          <WrapItem key={category}>
            <Button
              onClick={() => onCategoryChange(category)}
              bg={selectedCategory === category ? '#0a8c42' : '#0d1f15'}
              color={selectedCategory === category ? '#f6fbf8' : '#b9c8bd'}
              border="1px solid"
              borderColor={selectedCategory === category ? '#34b66f' : '#1b6f42'}
              _hover={{ bg: selectedCategory === category ? '#087639' : '#173726' }}
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
