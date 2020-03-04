import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Auth from '../../auth/Auth'
const style = {
    container: {
        border: "1px solid #123aaa",
        width: "fit-content",
        margin: "auto",
    }
}

// const { t, i18n } = useTranslation();
class TranslationSample extends Component {

    constructor(props) {
        super(props);
        this.state = { count: 0 };
    }


    handleClick = (lang) => {
        const { i18n } = this.props;
        console.log("lang", lang)
        i18n.changeLanguage(lang);
    }

    translateFromServer = async () => {
        console.log("click")
        let [res, err] = await Auth.superAuthFetch(`/api/Games/ `)
        if (err) console.log("err", err)
        if (res) {
            console.log("res")
            // this.setState({ count: res })
        }
        else { console.log("res") }
    }

    render() {
        const { t } = this.props;
        return (
            <div >
                <div className="btn-group mb-3">
                    <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {t('select-lang')}
                    </button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <button onClick={() => { this.handleClick("en-US") }} className="dropdown-item" type="button" style={{ fontSize: "80%" }}>English</button>
                        <button onClick={() => { this.handleClick("heb") }} className="dropdown-item" type="button" style={{ fontSize: "80%" }}>Hebrew</button>
                    </div>
                </div>

                <div className="p-4" /*style={style.container}*/>
                    <div className="d-block">
                        <label>{t('username-lable')}</label>
                        <input placeholder={t('type')} />
                    </div>
                    <br />

                    <div className="d-block">
                        <label>{t('password-lable')}</label>
                        <input placeholder={t('type')} />
                    </div>

                    <button className="btn btn-primary m-1">{t('login-btn')}</button>
                    <button onClick={this.translateFromServer} className="btn btn-primary m-1">click</button>

                </div>

            </div>
        );
    }
}
export default withTranslation()(TranslationSample);


