import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, AuthService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreditCardValidator } from 'angular-cc-library';
import { error } from 'selenium-webdriver';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class CardsListComponent implements OnInit {
    @ViewChild('card_form_modal') cardFormModal: TemplateRef<any>;

    public cards: any;
    public pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;
    modalRef: BsModalRef;
    userPaymentForm;
    userPaymentSubmitted;
    user;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private pagerService: PagerService,
        public route: ActivatedRoute,
        public router: Router,
        private modalService: BsModalService,
        private auth: AuthService,
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.deleteItems = [];
        this.loadCardsList();

        this.auth.getUserInfo().subscribe(user => {
            if (user && !user.loading) {
                this.user = user;
            }
        });

        this.userPaymentForm = this._fb.group({
            'card_holder_name': ['', [Validators.required]],
            'card_number': ['', [Validators.required, CreditCardValidator.validateCCNumber]],
            'card_month_year': ['', [CreditCardValidator.validateExpDate]],
            'card_cvv': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
        });
    }

    openCardFormModal() {
        this.alert.clear();
        this.userPaymentForm.reset();
        this.userPaymentSubmitted = false;
        this.modalRef = this.modalService.show(this.cardFormModal, {
            animated: true,
            keyboard: false,
            backdrop: true,
            ignoreBackdropClick: true
        });
    }

    setInputClass(input) {
        const invalid = this.userPaymentForm.get(input).invalid;
        return (invalid && this.userPaymentSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.userPaymentForm.get(input).invalid;
        return (invalid && this.userPaymentSubmitted) ? 'has-danger' : '';
    }

    saveUserPayment() {
        this.alert.clear();
        this.userPaymentSubmitted = true;
        if (this.userPaymentForm.valid) {
            const mon_yr = this.userPaymentForm.value.card_month_year.split("/");
            const data = {
                customer_id: this.user.id,
                card_number: this.userPaymentForm.value.card_number,
                month: mon_yr[0].trim(),
                year: mon_yr[1].trim(),
                cvv: this.userPaymentForm.value.card_cvv,
            }
            this.rest.addCrditCard(data).subscribe(public_hash => {
                if(public_hash.substring(0, 5).toLowerCase() === 'error') {
                    this.modalRef.hide();
                    this.alert.error(public_hash);
                } else {
                    this.modalRef.hide();
                    this.loadCardsList();
                    this.alert.success('New card details saved succesfully!');
                }
            }, err => {
                this.modalRef.hide();
                this.alert.error(err, false, 'popup');
            });
        } else {
            this.alert.error('Please check the form to enter all required details', false, 'popup');
        }
    }

    setDefaultCard(card) {
        if(!confirm("Are you sure want to change the default card?")) {
            return;
        }
        this.alert.clear();
        this.rest.saveItem(false, {primary_card: {card_id: card.entity_id}}, 'payment/card/default').subscribe(res => {
            this.alert.success('The default card was changed succesfully!');
            card.is_default = 1;
            this.loadCardsList();
        }, err => {
            this.alert.error('Server error!');            
        })
    }

    deleteCard(card) {
        if(!confirm("Are you sure want to delete the card detail?")) {
            return;
        }
        this.alert.clear();
        this.rest.saveItem(false, {public_hash: card.public_hash}, 'payment/delete/card').subscribe(res => {
            this.alert.success('The card details deleted succesfully!');
            this.loadCardsList();
        }, err => {
            this.alert.error('Server error!');            
        })
    }

    loadCardsList() {
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItem(1, 'payment/listcreditcard')
            .subscribe(cards => {
            this.loadingList = false;
            this.initCardsList(cards);
        });
    }

    initCardsList(cards) {
        this.cards = cards.map(x => {
            x.details = JSON.parse(x.details);
            return x;
        });
    }
}
