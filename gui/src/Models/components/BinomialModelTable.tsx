/**
 * Created by justin on 8/4/16.
 */
import * as React from 'react';
import * as _ from 'lodash';
import Table from '../../Projects/components/Table';
import Row from '../../Projects/components/Row';
import Cell from '../../Projects/components/Cell';
import FilterDropdown from './FilterDropdown';
import RocGraph from './RocGraph';
import { Link } from 'react-router';

interface Props {
  onFilter: Function,
  sortCriteria: string[],
  items: any,
  projectId: number,
  openDeploy: Function
}

export default class BinomialModelTable extends React.Component<Props, any> {
  render() {
    return (
      <Table>
        <Row header={true}>
          <Cell>
            <FilterDropdown onFilter={this.props.onFilter.bind(this)} sortCriteria={this.props.sortCriteria}/>
          </Cell>
          <Cell>
            MODEL
          </Cell>
          <Cell>
            AUC
          </Cell>
          <Cell>
            Gini
          </Cell>
          <Cell>
            MSE
          </Cell>
          <Cell>
            Logloss
          </Cell>
          <Cell>
            R<sup>2</sup>
          </Cell>
          <Cell className="graph">
            ROC
          </Cell>
          <Cell>
            <div className="actions">
              ACTIONS
            </div>
          </Cell>
        </Row>
        {this.props.items.map((model, i) => {
          let modelMetrics = JSON.parse(model.metrics);
          let trainingMetrics = _.get(modelMetrics, 'models[0].output.training_metrics', {});
          let fpr = _.get(modelMetrics, 'models[0].output.training_metrics.thresholds_and_metric_scores.data[17]', []);
          let tpr = _.get(modelMetrics, 'models[0].output.training_metrics.thresholds_and_metric_scores.data[18]', []);
          let data = [];
          tpr.map((val, i) => {
            data.push({
              tpr: val,
              fpr: fpr[i]
            });
          });
          return (
            <Row key={i}>
              <Cell></Cell>
              <Cell>
                <div className="metadata">
                  <div className="model-name">
                    {model.name}
                  </div>
                  <div>
                    {model.cluster_name}
                  </div>
                  <div>
                    {model.createdAt}
                  </div>
                  <div>
                    {model.max_runtime}
                  </div>
                </div>
              </Cell>
              <Cell>
                {trainingMetrics.AUC.toFixed(6)}
              </Cell>
              <Cell>
                {trainingMetrics.Gini.toFixed(6)}
              </Cell>
              <Cell>
                {trainingMetrics.MSE.toFixed(6)}
              </Cell>
              <Cell>
                {trainingMetrics.logloss.toFixed(6)}
              </Cell>
              <Cell>
                {trainingMetrics.r2.toFixed(6)}
              </Cell>
              <Cell className="graph">
                <RocGraph data={data}/>
              </Cell>
              <Cell>
                <ul className="actions">
                  <li><Link to={'/projects/' + this.props.projectId + '/models/' + model.id}><span><i
                    className="fa fa-eye"></i></span><span>view model details</span></Link></li>
                  <li className="labels"><span><i className="fa fa-tags"></i></span> label as
                        <span className="label-selector">
                          <select name="labelSelect">
                            <option value="prod">test</option>
                            <option value="test">stage</option>
                            <option value="prod">prod</option>
                          </select>
                        </span>
                  </li>
                  <li onClick={this.props.openDeploy.bind(this, model)}><span><i className="fa fa-arrow-up"></i></span>
                    <span>deploy model</span></li>
                </ul>
              </Cell>
            </Row>
          );
        })}
      </Table>
    );
  }
}