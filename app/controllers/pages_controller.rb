class PagesController < ApplicationController
  def new 
    @page = Page.new
  end

  def create
    @page = Page.new(page_params)
    if @page.save
      flash[:success] = "Successfuly page created"
      redirect_to @page
    else
      render 'new'
    end
  end

  def edit
    @page = Page.find(params[:id])
  end

  def update
    page = Page.find(params[:id])
    if page.update_attributes(page_params)
      redirect_to page
    else
      render 'edit'
    end
  end

  def index
    @pages = Page.all
  end

  def show
    @page = Page.find(params[:id])
  end

  private
    def page_params
      params.require(:page).permit(:title, :content)
    end
end
