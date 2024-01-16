import { useMDXComponents } from "@mdx-js/react";

import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { DocBlock, useApiDocContext, ApiDocHeading } from ".";
import { GridItem, chakra } from "@chakra-ui/react";
import { ResponsiveGrid } from "./ResponsiveGrid";
import { sortWithCustomOrder } from "./sortWithCustomOrder";

export function EnumDetails({
  canonicalReference,
  headingLevel,
  customOrder = [],
}) {
  const MDX = useMDXComponents();
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);
  console.log(item);

  const sortedMembers = useMemo(
    () =>
      item.members.map(getItem).sort(sortWithCustomOrder(customOrder)),
    [item.members, getItem, customOrder]
  );

  return (
    <>
      <ApiDocHeading
        canonicalReference={canonicalReference}
        headingLevel={headingLevel}
      />
      <DocBlock
        canonicalReference={canonicalReference}
        heading
        headingLevel={3}
      />

      <GridItem className="row">
        <chakra.h6
          className="fullWidth"
          mb="4"
          fontWeight="bold"
          textTransform="uppercase"
          fontSize="sm"
          letterSpacing="wider"
        >
          Enumeration Members
        </chakra.h6>
      </GridItem>

      <ResponsiveGrid columns="1fr">
        {sortedMembers.map((member) => (
          <React.Fragment key={member.id}>
            <GridItem
              className="cell"
              fontSize="md"
              sx={{ code: { bg: "none", p: 0 } }}
            >
              <chakra.h6 fontSize="lg" mb="1" mr="1">
                <MDX.inlineCode>{member.displayName}</MDX.inlineCode>
              </chakra.h6>
              <DocBlock canonicalReference={member.canonicalReference} />
            </GridItem>
          </React.Fragment>
        ))}
      </ResponsiveGrid>
    </>
  );
}

EnumDetails.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  headingLevel: PropTypes.number.isRequired,
  customOrder: PropTypes.arrayOf(PropTypes.string),
};