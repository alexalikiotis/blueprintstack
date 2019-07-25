import React, { useState } from 'react';
import injectSheet from 'react-jss';
import gql from 'graphql-tag';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { FaPlay, FaCog } from 'react-icons/fa';

import Button from '../Button';
import styles from './HeaderStyles';

const GET_EDITOR_VALUE = gql`
  {
    editorValue @client
  }
`;

const GET_BLUEPRINT_TEMPLATE = gql`
  query Template($blueprint: String!) {
    template(blueprint: $blueprint)
  }
`;

const UPDATE_PREVIEW = gql`
  mutation UpdatePreview($value: String!) {
    updatePreview(value: $value) @client
  }
`;

const Header = ({ classes }) => {
  // React hooks
  const [loading, setLoading] = useState(false);

  // Apollo hooks
  const client = useApolloClient();
  const { data } = useQuery(GET_EDITOR_VALUE);

  // Update apollo local state
  const updatePreview = async blueprint => {
    if (!blueprint) return;

    setLoading(true);
    const { data } = await client.query({
      query: GET_BLUEPRINT_TEMPLATE,
      variables: { blueprint },
    });

    await client.mutate({
      mutation: UPDATE_PREVIEW,
      variables: { value: data.template },
    });
    setLoading(false);
  };

  return (
    <div className={classes.header}>
      <div className={classes.logo}>BlueprintDash</div>
      <div className={classes.options}>
        <Button
          text={loading ? 'Running...' : 'Run'}
          icon={<FaPlay />}
          loading={loading}
          onClick={() => updatePreview(data.editorValue)}
        />
        <Button text="Settings" icon={<FaCog />} />
      </div>
    </div>
  );
};

export default injectSheet(styles)(Header);
