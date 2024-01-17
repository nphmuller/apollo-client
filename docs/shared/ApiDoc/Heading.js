import { useMDXComponents } from "@mdx-js/react";
import PropTypes from "prop-types";
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { FunctionSignature } from ".";
import { useApiDocContext } from "./Context";

export function Heading({
  headingLevel,
  link,
  children,
  as,
  minVersion,
  ...props
}) {
  const MDX = useMDXComponents();
  let heading = children;

  if (link) {
    heading = (
      <MDX.PrimaryLink href={`#${props.id}`}>{heading}</MDX.PrimaryLink>
    );
  }
  const Tag = as ? as : MDX[`h${headingLevel}`];

  return (
    <Tag {...props}>
      {heading}
      {minVersion ?
        <MDX.MinVersionTag minVersion={minVersion} />
      : null}
    </Tag>
  );
}
Heading.propTypes = {
  headingLevel: PropTypes.number,
  link: PropTypes.bool,
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  as: PropTypes.any,
  minVersion: PropTypes.string,
};

export function SubHeading({
  canonicalReference,
  link = typeof headingLevel === "number" && headingLevel <= 4,
  ...props
}) {
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);

  return (
    <Heading
      id={
        props.id || link ?
          `${item.displayName}-${props.title || props.children}`.toLowerCase()
        : undefined
      }
      {...props}
    />
  );
}
SubHeading.propTypes = {
  ...Heading.propTypes,
  canonicalReference: PropTypes.string.isRequired,
};

export function ApiDocHeading({
  canonicalReference,
  headingLevel,
  link = typeof headingLevel === "number" && headingLevel <= 4,
  signature = false,
  since = false,
  prefix = "",
  suffix = "",
  ...props
}) {
  const MDX = useMDXComponents();
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);
  let heading =
    (
      signature &&
      (item.kind === "MethodSignature" ||
        item.kind === "Function" ||
        item.kind === "Method")
    ) ?
      <FunctionSignature
        canonicalReference={canonicalReference}
        parameterTypes={false}
      />
    : <MDX.inlineCode>{item.displayName}</MDX.inlineCode>;

  heading = (
    <Heading
      headingLevel={headingLevel}
      id={link ? item.displayName.toLowerCase() : undefined}
      link={link}
      minVersion={since && item.comment?.since ? item.comment.since : undefined}
      {...props}
    >
      {prefix}
      {heading}
      {suffix}
    </Heading>
  );

  return <Box pt="4">{heading}</Box>;
}
ApiDocHeading.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
  headingLevel: PropTypes.number,
  link: PropTypes.bool,
  signature: PropTypes.bool,
  since: PropTypes.bool,
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export function SourceLink({ canonicalReference }) {
  const MDX = useMDXComponents();
  const getItem = useApiDocContext();
  const item = getItem(canonicalReference);
  return item.file ?
      <Text fontWeight="normal" size="sm">
        <MDX.PrimaryLink
          href={`https://github.com/apollographql/apollo-client/blob/main/${item.file}`}
          isExternal
        >
          ({item.file})
        </MDX.PrimaryLink>
      </Text>
    : null;
}
SourceLink.propTypes = {
  canonicalReference: PropTypes.string.isRequired,
};

export function SectionHeading(props) {
  return (
    <Text
      className="fullWidth"
      mb="4"
      fontWeight="bold"
      textTransform="uppercase"
      fontSize="sm"
      letterSpacing="wider"
      {...props}
    />
  );
}
SectionHeading.propTypes = Text.propTypes;
