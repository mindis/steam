import * as React from 'react';
import * as _ from 'lodash';
import PageHeader from '../Projects/components/PageHeader';
import TabNavigation from '../Projects/components/TabNavigation';
import { Identity, Permission } from '../Proxy/Proxy';
import UserAccess from './components/UserAccess';
import RolePermissions from './components/RolePermissions';
import './styles/users.scss';

interface Props {
  identity: Identity
  permission: Permission
}

export default class Users extends React.Component<Props, any> {

  constructor() {
    super();
    this.state = {
      tabs: {
        users: {
          label: 'USERS',
          isSelected: true,
          onClick: this.clickHandler.bind(this),
          component: <UserAccess />
        },
        packaging: {
          label: 'ROLES',
          isSelected: false,
          onClick: this.clickHandler.bind(this),
          component: <RolePermissions />
        }
      },
      isSelected: 'users'
    };
  }

  componentWillMount(): void {
    this.setState({
      tabs: {
        users: {
          label: 'USERS',
          isSelected: true,
          onClick: this.clickHandler.bind(this),
          component: <UserAccess />
        },
        roles: {
          label: 'ROLES',
          isSelected: false,
          onClick: this.clickHandler.bind(this),
          component: <RolePermissions />
        }
      }
    });
  }

  clickHandler(tab) {
    let key = _.findKey(this.state.tabs, tab);
    let newState = _.cloneDeep(this.state);
    Object.keys(newState.tabs).map((tab) => {
      newState.tabs[tab].isSelected = false;
    });
    newState.tabs[key].isSelected = true;
    newState.isSelected = key;
    this.setState(newState);
  }

  render(): React.ReactElement<HTMLDivElement> {
    return (
      <div className="users">
        <PageHeader>USERS</PageHeader>
        <div className="panel-container">
          <TabNavigation tabs={this.state.tabs} />
          {this.state.tabs.users.isSelected === true ?
            <UserAccess /> : null}
          {this.state.tabs.roles.isSelected === true ?
            <RolePermissions /> : null}
        </div>
      </div>
    );
  }
}
