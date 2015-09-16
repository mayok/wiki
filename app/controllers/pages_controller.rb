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
