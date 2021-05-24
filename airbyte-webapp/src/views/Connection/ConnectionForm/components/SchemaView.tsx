import React, { useCallback, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import TreeView from "components/TreeView";
import { Cell, Header, LightCell } from "components/SimpleTableComponents";
import { DestinationSyncMode, SyncSchema } from "core/domain/catalog";
import Search from "./Search";

const TreeViewContainer = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.greyColor0};
  margin-bottom: 29px;
  border-radius: 4px;
`;

const SchemaHeader = styled(Header)`
  min-height: 28px;
  margin-bottom: 5px;
`;

const SchemaTitle = styled.div`
  display: inline-block;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin: 0 11px 13px 0;
`;

type SchemaViewProps = {
  additionalControl?: React.ReactNode;
  schema: SyncSchema;
  onChangeSchema: (schema: SyncSchema) => void;
  destinationSupportedSyncModes: DestinationSyncMode[];
};

const SchemaView: React.FC<SchemaViewProps> = ({
  schema,
  destinationSupportedSyncModes,
  onChangeSchema,
  additionalControl,
}) => {
  const [searchString, setSearchString] = useState("");
  const hasSelectedItem = useMemo(
    () =>
      schema.streams.some(
        (streamNode) =>
          streamNode.config.selected &&
          streamNode.stream.name
            .toLowerCase()
            .includes(searchString.toLowerCase())
      ),
    [schema.streams, searchString]
  );

  const onCheckAll = useCallback(() => {
    const allSelectedValues = !hasSelectedItem;

    const newSchema = schema.streams.map((streamNode) => {
      if (
        streamNode.stream.name
          .toLowerCase()
          .includes(searchString.toLowerCase())
      ) {
        return {
          ...streamNode,
          config: { ...streamNode.config, selected: allSelectedValues },
        };
      }

      return streamNode;
    });
    onChangeSchema({ streams: newSchema });
  }, [hasSelectedItem, onChangeSchema, schema.streams, searchString]);

  return (
    <>
      <div>
        <SchemaTitle>
          <FormattedMessage id="form.dataSync" />
        </SchemaTitle>
        {additionalControl}
      </div>
      <SchemaHeader>
        <Cell flex={2}>
          <Search
            onCheckAll={onCheckAll}
            onSearch={setSearchString}
            hasSelectedItem={hasSelectedItem}
          />
        </Cell>
        <LightCell>
          <FormattedMessage id="form.namespace" />
        </LightCell>
        <LightCell>
          <FormattedMessage id="form.dataType" />
        </LightCell>
        <LightCell>
          <FormattedMessage id="form.cleanedName" />
        </LightCell>
        <LightCell>
          <FormattedMessage id="form.primaryKey" />
        </LightCell>
        <LightCell>
          <FormattedMessage id="form.cursorField" />
        </LightCell>
        <LightCell flex={1.5}>
          <FormattedMessage id="form.syncSettings" />
        </LightCell>
      </SchemaHeader>
      <TreeViewContainer>
        <TreeView
          schema={schema}
          onChangeSchema={onChangeSchema}
          destinationSupportedSyncModes={destinationSupportedSyncModes}
          filter={searchString}
        />
      </TreeViewContainer>
    </>
  );
};

export default SchemaView;
